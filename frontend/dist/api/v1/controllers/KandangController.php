<?php

class KandangController {
    public static function getAll($pdo, $query = []) {
        try {
            $stmt = $pdo->query('SELECT * FROM kandang');
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Kandang retrieved');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function create($pdo, $body) {
        try {
            $nama = $body['nama'] ?? null;
            $lokasi = $body['lokasi'] ?? null;
            $kapasitas = $body['kapasitas'] ?? null;

            $stmt = $pdo->prepare('INSERT INTO kandang (nama, lokasi, kapasitas) VALUES (?, ?, ?)');
            $stmt->execute([$nama, $lokasi, $kapasitas]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'nama' => $nama, 'lokasi' => $lokasi, 'kapasitas' => $kapasitas];
            sendResponse($data, 'Kandang created', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function update($pdo, $id, $body) {
        try {
            $nama = $body['nama'] ?? null;
            $lokasi = $body['lokasi'] ?? null;
            $kapasitas = $body['kapasitas'] ?? null;

            $stmt = $pdo->prepare('UPDATE kandang SET nama = ?, lokasi = ?, kapasitas = ? WHERE id = ?');
            $stmt->execute([$nama, $lokasi, $kapasitas, $id]);
            
            $data = ['id' => $id, 'nama' => $nama, 'lokasi' => $lokasi, 'kapasitas' => $kapasitas];
            sendResponse($data, 'Kandang updated');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function delete($pdo, $id) {
        try {
            $stmt = $pdo->prepare('DELETE FROM kandang WHERE id = ?');
            $stmt->execute([$id]);
            sendResponse(null, 'Kandang deleted');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
