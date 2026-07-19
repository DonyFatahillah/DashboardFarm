<?php

class ProduksiController {
    public static function create($pdo, $body) {
        try {
            $kandang_id = $body['kandang_id'] ?? null;
            $tanggal = $body['tanggal'] ?? null;
            $jumlah_telur = $body['jumlah_telur'] ?? null;
            $berat_telur = $body['berat_telur'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO produksi_harian (kandang_id, tanggal, jumlah_telur, berat_telur) VALUES (?, ?, ?, ?)');
            $stmt->execute([$kandang_id, $tanggal, $jumlah_telur, $berat_telur]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'kandang_id' => $kandang_id, 'tanggal' => $tanggal, 'jumlah_telur' => $jumlah_telur, 'berat_telur' => $berat_telur];
            sendResponse($data, 'Produksi recorded', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $kandang_id = $query['kandang_id'] ?? null;
            $start = $query['start'] ?? null;
            $end = $query['end'] ?? null;

            $sql = 'SELECT p.*, k.nama as nama_kandang 
                    FROM produksi_harian p 
                    JOIN kandang k ON p.kandang_id = k.id 
                    WHERE 1=1';
            $params = [];

            if ($kandang_id) {
                $sql .= ' AND p.kandang_id = ?';
                $params[] = $kandang_id;
            }
            if ($start) {
                $sql .= ' AND p.tanggal >= ?';
                $params[] = $start;
            }
            if ($end) {
                $sql .= ' AND p.tanggal <= ?';
                $params[] = $end;
            }

            $sql .= ' ORDER BY p.tanggal DESC';

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse($data, 'Produksi retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
