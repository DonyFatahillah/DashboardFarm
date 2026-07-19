<?php

class UsersController {
    public static function getAll($pdo, $query = []) {
        try {
            $stmt = $pdo->query('SELECT u.id, u.username, u.role, u.kandang_id, k.nama as kandang_nama FROM users u LEFT JOIN kandang k ON u.kandang_id = k.id');
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse($data, 'Users retrieved successfully');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function findByName($pdo, $query = []) {
        try {
            $username = $query['username'] ?? null;
            $stmt = $pdo->prepare('SELECT id, username FROM users WHERE username = ?');
            $stmt->execute([$username]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            sendResponse($data, 'User found');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function create($pdo, $body) {
        try {
            $username = $body['username'] ?? null;
            $password = $body['password'] ?? null;
            $role = $body['role'] ?? null;
            $kandang_id = $body['kandang_id'] ?? null;

            // Check if username already exists
            $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                sendError('Username already exists', 400);
            }

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $pdo->prepare('INSERT INTO users (username, password, role, kandang_id) VALUES (?, ?, ?, ?)');
            $stmt->execute([$username, $hashedPassword, $role, $kandang_id]);
            
            $id = $pdo->lastInsertId();
            $data = ['id' => $id, 'username' => $username, 'role' => $role, 'kandang_id' => $kandang_id];
            sendResponse($data, 'User created successfully', 201);
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }

    public static function delete($pdo, $id) {
        try {
            $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
            $stmt->execute([$id]);
            sendResponse(null, 'User deleted successfully');
        } catch (Exception $e) {
            sendError($e->getMessage(), 500);
        }
    }
}
