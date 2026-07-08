<?php
header('Content-Type: application/json; charset=utf-8');

// Подключение к MySQL (настройте параметры под свой сервер)
$host = 'localhost';
$port = '3307';
$dbname = 'sosnovy_rai';
$user = 'pine_admin';
$pass = 'PineAdmin2024!';
$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к базе']);
    exit;
}

// Принимаем JSON
$input = json_decode(file_get_contents('php://input'), true);

// Валидация полей
$errors = [];
$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$sazhenec = trim($input['sazhenec'] ?? '');
$type = $input['type'] ?? 'обычная'; // 'обычная' или 'эксклюзивная'

if ($name === '') {
    $errors[] = 'Имя обязательно';
}
if ($phone === '') {
    $errors[] = 'Телефон обязателен';
} elseif (!preg_match('/^\+?[0-9\s\-()]{7,20}$/', $phone)) {
    // Простая проверка: только цифры, пробелы, скобки, минус, плюс
    $errors[] = 'Некорректный формат телефона';
}
if ($sazhenec === '') {
    $errors[] = 'Название саженца обязательно';
}
if (!in_array($type, ['обычная', 'эксклюзивная'])) {
    $type = 'обычная';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Защита от XSS (можно сохранять как есть, а при выводе экранировать)
// Вставляем данные через подготовленный запрос
$stmt = $pdo->prepare("INSERT INTO orders (name, phone, sazhenec, type) VALUES (:name, :phone, :sazhenec, :type)");
$stmt->execute([
    ':name' => $name,
    ':phone' => $phone,
    ':sazhenec' => $sazhenec,
    ':type' => $type
]);

// Успешный ответ
echo json_encode(['success' => true, 'message' => 'Заявка успешно сохранена']);