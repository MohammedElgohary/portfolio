<?php #!/usr/local/bin/php
class db
{
    // Main variable
    private  $sdn, $user, $pass;

    // Sets the charset UTF-8
    private $option = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"
    ), $con;

    // Constructor of the class
    private function __construct($host, $user = 'root', $pass = '', $database)
    {
        // Variable assignment
        $this->sdn = "mysql:host=" . $host . ";dbname=" . $database;
        $this->user = $user;
        $this->pass = $pass;

        // makes PDO Connection
        try {
            $this->con = new PDO(
                $this->sdn,
                $this->user,
                $this->pass,
                $this->option
            );
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // echo $e->getMessage();
        }
    }

    # to help to print insert Query
    public static function insertArray($arr) {
        $keys = "";
        $values = "";

        $index = 0;

        foreach ($arr as $key => $value) {
            $isStr = is_string($value);

            if ($index === 0) {
                $keys .= $key;

                if($isStr) {
                    $values .= "'$value'";
                } else {
                    $values .= $value;
                }
            } else {
                $keys .= ", " . $key;

                if($isStr) {
                    $values .= ", '" . $value . "'";
                } else {
                    $values .= ", " . $value;
                }
            }
            $index += 1;
        }
        return "(" . $keys . ") VALUES (" . $values . ")";
    }

    # to help to print update Query
    public static function updateArray($arr) {
        $str = "";
        $index = 0;

        foreach ($arr as $key => $value) {
            $isStr = is_string($value);

            if ($index === count($arr) - 1) {
                if($isStr) {
                    $str .= $key . "='" . $value. "'";
                } else {
                    $str .= $key . "=" . $value;
                }
            } else {
                if($isStr) {
                    $str .= $key . "='" . $value . "', ";
                } else {
                    $str .= $key . "=" . $value . ", ";
                }
            }
            $index += 1;
        }
        return $str;
    }

    // Insert , Update and Delete data from or to Database
    function query($queryString, $params = array())
    {
        try {
            $stmt = $this->con->prepare($queryString);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();
            return $rows;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    // Insert , Update and Delete data from or to Database
    function set($queryString, $params = array())
    {
        try {
            $stmt = $this->con->prepare($queryString);
            $stmt->execute($params);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    // Gets Data from Database as Array
    function get($queryString, $params = array())
    {
        try {
            $stmt = $this->con->prepare($queryString);
            $stmt->execute($params);

            $rows = $stmt->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return $rows;
    }

    // Gets Data from Database as Array
    function getOne($queryString, $params = array())
    {
        $rows = $this->get($queryString, $params);
        return @$rows[0];
    }

    // Gets Column Data from Database
    function getColumn($queryString, $params = array())
    {
        try {
            $stmt = $this->con->prepare($queryString);
            $stmt->execute($params);

            $column = $stmt->fetchColumn();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return $column;
    }

    // Gets Data from Database as JSON
    function getJson($queryString, $params = array())
    {
        return json_encode($this->get($queryString, $params));
    }
}

/*
    // initialize connection
    $db = new db("host", "user", "password", "database_name");

    # get Method ( GET Data )
    $users = $db->get("SELECT * FROM users"); // OR
    $user  = $db->get("SELECT * FROM users WHERE id=12"); // OR
    $user  = $db->get("SELECT * FROM users WHERE id=?", array(12));

    # query Method
    $users = $db->query("SELECT * FROM users"); // OR
    $user  = $db->query("SELECT * FROM users WHERE id=12"); // OR
    $user  = $db->query("SELECT * FROM users WHERE id=?", array(12));


    # set Method ( Insert, Update and Delete Data)
    $addParams = db::insertArray([
        "name" => "Mohammed El-gohary",
        "age" => 21,
    ]); // returns a string of => (name, age) VALUES ('Mohammed El-gohary', 21)

    $updateParams = db::updateArray([
        "name" => "Mohammed El-gohary",
        "age" => 21,
    ]); // returns a string of => name='Mohammed El-gohary', age=21

    // Inserting Data
    $db->set("INSERT INTO users (name, age) VALUES ('Mohammed El-gohary', 21)");
    $db->set("INSERT INTO users" . $addParams);


    // Updating Data
    $db->set("UPDATE users SET name='Mohammed El-gohary', age=21 WHERE id=5");
    $db->set("UPDATE users SET " . $updateParams . " WHERE id=5");
*/