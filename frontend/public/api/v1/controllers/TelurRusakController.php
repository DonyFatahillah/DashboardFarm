<?php

class TelurRusakController {
    public static function create($pdo, $body) {
        try {
            $kandang_id = $body['kandang_id'] ?? null;
            $tanggal = $body['tanggal'] ?? null;
            $jumlah = $body['jumlah'] ?? null;
            $kualitas_keterangan = $body['kualitas_keterangan'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO telur_rusak (kandang_id, tanggal, jumlah, kualitas_keterangan) VALUES (?, ?, ?, ?)');
            $stmt->execute([$kandang_id, $tanggal, $jumlah, $kualitas_keterangan]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'kandang_id' => $kandang_id, 'tanggal' => $tanggal, 'jumlah' => $jumlah, 'kualitas_keterangan' => $kualitas_keterangan];
            sendResponse($data, 'Record created', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getSummary($pdo, $query = []) {
        try {
            $sql = 'SELECT SUM(jumlah) as total_rusak, kualitas_keterangan FROM telur_rusak GROUP BY kualitas_keterangan';
            $stmt = $pdo->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Summary retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
