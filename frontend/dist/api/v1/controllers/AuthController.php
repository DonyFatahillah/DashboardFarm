<?php
class AuthController {
    public static function login($pdo, $body, $jwtSecret) {
        $username = $body['username'] ?? '';
        $password = $body['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            sendError('Invalid credentials', 401);
        }

        $payload = [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'kandang_id' => $user['kandang_id']
        ];
        
        $token = JWT::encode($payload, $jwtSecret);

        sendResponse([
            'user' => $payload,
            'token' => $token
        ], 'Login successful');
    }
}
