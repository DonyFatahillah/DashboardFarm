<?php

class HealthController {
    public static function create($pdo, $body) {
        try {
            $kandang_id = $body['kandang_id'] ?? null;
            $jenis_kegiatan = $body['jenis_kegiatan'] ?? null;
            $tanggal_rencana = $body['tanggal_rencana'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO kesehatan_ayam (kandang_id, jenis_kegiatan, tanggal_rencana) VALUES (?, ?, ?)');
            $stmt->execute([$kandang_id, $jenis_kegiatan, $tanggal_rencana]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'kandang_id' => $kandang_id, 'jenis_kegiatan' => $jenis_kegiatan, 'tanggal_rencana' => $tanggal_rencana];
            sendResponse($data, 'Reminder created', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function getAll($pdo, $query = []) {
        try {
            $sql = 'SELECT k.*, kn.nama as nama_kandang FROM kesehatan_ayam k JOIN kandang kn ON k.kandang_id = kn.id ORDER BY k.tanggal_rencana ASC';
            $stmt = $pdo->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Reminders retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
