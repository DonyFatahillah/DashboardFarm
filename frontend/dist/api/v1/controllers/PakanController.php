<?php

class PakanController {
    public static function create($pdo, $body) {
        try {
            $kandang_id = $body['kandang_id'] ?? null;
            $tanggal = $body['tanggal'] ?? null;
            $jenis_pakan = $body['jenis_pakan'] ?? null;
            $jumlah_kg = $body['jumlah_kg'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO pakan_harian (kandang_id, tanggal, jenis_pakan, jumlah_kg) VALUES (?, ?, ?, ?)');
            $stmt->execute([$kandang_id, $tanggal, $jenis_pakan, $jumlah_kg]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'kandang_id' => $kandang_id, 'tanggal' => $tanggal, 'jenis_pakan' => $jenis_pakan, 'jumlah_kg' => $jumlah_kg];
            sendResponse($data, 'Pakan recorded', 201);
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
                    FROM pakan_harian p
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
            
            sendResponse($data, 'Pakan retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
