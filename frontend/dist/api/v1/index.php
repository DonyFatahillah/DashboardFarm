<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt.php';

$endpoint = $_GET['endpoint'] ?? '';
$parts = explode('/', $endpoint);
$resource = $parts[0] ?? '';
$action = $parts[1] ?? '';

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

function sendResponse($data, $message = '', $status = 200) {
    http_response_code($status);
    echo json_encode(['success' => $status >= 200 && $status < 300, 'message' => $message, 'data' => $data]);
    exit;
}

function sendError($message, $status = 400) {
    sendResponse(null, $message, $status);
}

function authenticate() {
    global $jwtSecret;
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $decoded = JWT::decode($matches[1], $jwtSecret);
        if ($decoded) return $decoded;
    }
    sendError('Unauthorized', 401);
}

// Router
try {
    if ($resource === 'auth' && $action === 'login') {
        require_once __DIR__ . '/controllers/AuthController.php';
        AuthController::login($pdo, $body, $jwtSecret);
    } 
    elseif ($resource === 'public' && $action === 'stats') {
        require_once __DIR__ . '/controllers/PublicController.php';
        PublicController::getStats($pdo);
    }
    elseif ($resource === 'dashboard') {
        $user = authenticate();
        require_once __DIR__ . '/controllers/DashboardController.php';
        if ($action === 'summary') {
            DashboardController::summary($pdo);
        } elseif ($action === 'charts') {
            DashboardController::chart($pdo);
        } else {
            sendError('Not Found', 404);
        }
    }
    else {
        sendError('Not Found', 404);
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
