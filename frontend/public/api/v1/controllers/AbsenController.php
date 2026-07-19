<?php

class AbsenController {
    public static function create($pdo, $body) {
        try {
            $user_id = $body['user_id'] ?? null;
            $nama_luar = $body['nama_luar'] ?? null;
            $tanggal = $body['tanggal'] ?? null;
            $status = $body['status'] ?? null;
            $keterangan = $body['keterangan'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO absen_karyawan (user_id, nama_luar, tanggal, status, keterangan) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$user_id, $nama_luar, $tanggal, $status, $keterangan]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'user_id' => $user_id, 'nama_luar' => $nama_luar, 'tanggal' => $tanggal, 'status' => $status, 'keterangan' => $keterangan];
            sendResponse($data, 'Attendance recorded', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $sql = 'SELECT a.*, COALESCE(u.username, a.nama_luar) as username 
                    FROM absen_karyawan a 
                    LEFT JOIN users u ON a.user_id = u.id 
                    ORDER BY a.tanggal DESC';
            $stmt = $pdo->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Attendance list retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
