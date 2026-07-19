<?php

class KematianController {
    public static function create($pdo, $body) {
        try {
            $kandang_id = $body['kandang_id'] ?? null;
            $tanggal = $body['tanggal'] ?? null;
            $jumlah_mati = $body['jumlah_mati'] ?? null;
            $jumlah_sortir = $body['jumlah_sortir'] ?? 0;
            $penyebab = $body['penyebab'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO kematian_harian (kandang_id, tanggal, jumlah_mati, jumlah_sortir, penyebab) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$kandang_id, $tanggal, $jumlah_mati, $jumlah_sortir, $penyebab]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'kandang_id' => $kandang_id, 'tanggal' => $tanggal, 'jumlah_mati' => $jumlah_mati, 'jumlah_sortir' => $jumlah_sortir, 'penyebab' => $penyebab];
            sendResponse($data, 'Kematian recorded', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $kandang_id = $query['kandang_id'] ?? null;
            $start = $query['start'] ?? null;
            $end = $query['end'] ?? null;

            $sql = 'SELECT km.*, k.nama as nama_kandang
                    FROM kematian_harian km
                    JOIN kandang k ON km.kandang_id = k.id
                    WHERE 1=1';
            $params = [];

            if ($kandang_id) {
                $sql .= ' AND km.kandang_id = ?';
                $params[] = $kandang_id;
            }
            if ($start) {
                $sql .= ' AND km.tanggal >= ?';
                $params[] = $start;
            }
            if ($end) {
                $sql .= ' AND km.tanggal <= ?';
                $params[] = $end;
            }

            $sql .= ' ORDER BY km.tanggal DESC';

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse($data, 'Kematian retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
