<?php

class PupukController {
    public static function create($pdo, $body) {
        try {
            $tanggal = $body['tanggal'] ?? null;
            $pembeli = $body['pembeli'] ?? null;
            $jumlah_karung = $body['jumlah_karung'] ?? null;
            $harga_per_karung = $body['harga_per_karung'] ?? null;
            $total_harga = $body['total_harga'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO penjualan_pupuk (tanggal, pembeli, jumlah_karung, harga_per_karung, total_harga) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$tanggal, $pembeli, $jumlah_karung, $harga_per_karung, $total_harga]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'tanggal' => $tanggal, 'pembeli' => $pembeli, 'jumlah_karung' => $jumlah_karung, 'harga_per_karung' => $harga_per_karung, 'total_harga' => $total_harga];
            sendResponse($data, 'Sale recorded', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $stmt = $pdo->query('SELECT * FROM penjualan_pupuk ORDER BY tanggal DESC');
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Sales retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
