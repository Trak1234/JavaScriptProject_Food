<?php
$_POST = json_decode(file_get_contents('php://input'), true);
esho var_dump($_POST);