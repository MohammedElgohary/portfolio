# DB

## initialize connection
```php
  $db = new db("host", "user", "password", "database_name");
```

## get Method ( GET Data )

```php
  $users = $db->get("SELECT * FROM users"); // OR
  $user  = $db->get("SELECT * FROM users WHERE id=12"); // OR
  $user  = $db->get("SELECT * FROM users WHERE id=?", array(12));
```

## query Method
```php
  $users = $db->query("SELECT * FROM users"); // OR
  $user  = $db->query("SELECT * FROM users WHERE id=12"); // OR
  $user  = $db->query("SELECT * FROM users WHERE id=?", array(12));
```


## set Method ( Insert, Update and Delete Data)

```php
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
```
