<?php #!/usr/local/bin/php

  # Must set these fields
  $host = "localhost";
  $user = "root";
  $password = "";
  $database = "";

  $db_obj = mysqli_connect($host, $user, $password, $database);

  $db = function ($db_obj, $query) {
    $stmt = $db_obj->prepare($query);
    $stmt->execute();
    return $stmt->get_result();
  };

  # to help to print insert Query
  $ArrInsert = function ($arr) {
    $first = "";
    $last = "";

    $index = 0;

    foreach ($arr as $key => $value) {

      if ($index === 0) {
        $first .= $key;
        $last .= $value;
      } else {
        $first .= ", " . $key;
        $last .= ", " . $value;
      }
      $index += 1;
    }
    return "(" . $first . ") VALUES (" . $last . ")";
  };

  # to help to print update Query
  $ArrUpdate = function ($arr) {
    $str = "";
    $index = 0;

    foreach ($arr as $key => $value) {

      if ($index === count($arr) - 1) {
        $str .= $key . "=" . $value;
      } else {
        $str .= $key . "=" . $value . ", ";
      }
      $index += 1;
    }
    return $str;
  };

  # to get the object Data that returned from the functions bellow
  function getObject($obj)
  {
    $arr = array();

    if ($obj->num_rows > 0) {
      while ($row = $obj->fetch_assoc()) {
        $arr[] = $row;
      }
    }

    return $arr;
  }

  // to execute an sql query
  $query = function ($query) {
    $result = $GLOBALS['db']($GLOBALS['db_obj'], $query);
    return getObject($result);
  };
