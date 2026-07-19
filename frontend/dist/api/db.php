<?php
$envPath = __DIR__ . '/../../../backend/.env';
$env = [];
if (file_exists($envPath)) {
    $env = parse_ini_file($envPath);
}

$host = $env['DB_HOST'] ?? '127.0.0.1';
$user = $env['DB_USER'] ?? 'busr4192_farm_management';
$pass = $env['DB_PASSWORD'] ?? 'af@bswNMbFRwT9c';
$dbname = $env['DB_NAME'] ?? 'busr4192_farm_management';
$port = $env['DB_PORT'] ?? '3306';

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Database Connection Failed']);
    exit;
}

$jwtSecret = $env['JWT_SECRET'] ?? 'supersecretfarmkey123';
$geminiKey = $env['GEMINI_API_KEY'] ?? 'secret';
