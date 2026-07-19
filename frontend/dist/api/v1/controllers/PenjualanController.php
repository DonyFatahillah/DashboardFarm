<?php

class PenjualanController {
    public static function create($pdo, $body) {
        try {
            $tanggal = $body['tanggal'] ?? null;
            $pembeli = $body['pembeli'] ?? null;
            $jumlah_kg = $body['jumlah_kg'] ?? null;
            $harga_per_kg = $body['harga_per_kg'] ?? null;
            $total_harga = $body['total_harga'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO penjualan_telur (tanggal, pembeli, jumlah_kg, harga_per_kg, total_harga) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$tanggal, $pembeli, $jumlah_kg, $harga_per_kg, $total_harga]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'tanggal' => $tanggal, 'pembeli' => $pembeli, 'jumlah_kg' => $jumlah_kg, 'harga_per_kg' => $harga_per_kg, 'total_harga' => $total_harga];
            sendResponse($data, 'Penjualan recorded', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $start = $query['start'] ?? null;
            $end = $query['end'] ?? null;

            $sql = 'SELECT * FROM penjualan_telur WHERE 1=1';
            $params = [];

            if ($start) {
                $sql .= ' AND tanggal >= ?';
                $params[] = $start;
            }
            if ($end) {
                $sql .= ' AND tanggal <= ?';
                $params[] = $end;
            }

            $sql .= ' ORDER BY tanggal DESC';

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse($data, 'Penjualan retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
