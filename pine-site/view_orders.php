<?php
$host = 'localhost';
$port = '3307';
$dbname = 'sosnovy_rai';
$user = 'pine_admin';
$pass = 'PineAdmin2024!';
$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die('Ошибка подключения к базе данных.');
}

// Удаляем заявки старше 15 минут
$pdo->exec("DELETE FROM orders WHERE created_at < NOW() - INTERVAL 15 MINUTE");

$stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
$orders = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Список заявок — Сосновый Рай</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .orders-table th, .orders-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        .orders-table th {
            background: #1e3b20;
            color: white;
        }
        .orders-table tr:hover {
            background: #f5f9f0;
        }
        .back-link {
            display: inline-block;
            margin-top: 30px;
            color: #1e3b20;
            font-weight: bold;
            text-decoration: none;
        }
    </style>
</head>
<body style="background:#f1f5e9; padding:40px 20px;">
    <div class="container">
        <h1 style="color:#1e3b20; margin-bottom:10px;">🌲 Поступившие заявки</h1>
        <?php if (count($orders) > 0): ?>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Саженец</th>
                        <th>Тип</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($orders as $order): ?>
                    <tr>
                        <td><?= htmlspecialchars($order['id']) ?></td>
                        <td><?= htmlspecialchars($order['name']) ?></td>
                        <td><?= htmlspecialchars($order['sazhenec']) ?></td>
                        <td><?= htmlspecialchars($order['type']) ?></td>
                        <td><?= htmlspecialchars($order['created_at']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>Пока нет ни одной заявки.</p>
        <?php endif; ?>
        <a href="index.html" class="back-link">← Вернуться на сайт</a>
    </div>
</body>
</html>
