//use path module
const path = require("path");
//use express module
const express = require("express");
//use hbs view engine
const hbs = require("hbs");
//use bodyParser middleware
const bodyParser = require("body-parser");
//use mysql database
const mysql = require("mysql");
const app = express();

//set views file
app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use("/assets", express.static(__dirname + "/public"));

// Konfigurasi koneksi ke database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_lingkom'
});

// Membuka koneksi ke database
conn.connect((err) => {
  if (err) throw err;
  console.log('Terhubung ke database');
});

// Mengatur port server
const port = 3000;

// Menampilkan data dari tabel tbl_transaksi
app.get('/', (req, res) => {
  let sqlKasMasuk = 'SELECT SUM(kas_masuk) AS totalKasMasuk FROM tbl_transaksi';
  let sqlKasKeluar = 'SELECT SUM(kas_keluar) AS totalKasKeluar FROM tbl_transaksi';

  let queryKasMasuk = conn.query(sqlKasMasuk, (err, resultKasMasuk) => {
    if (err) throw err;

    let queryKasKeluar = conn.query(sqlKasKeluar, (err, resultKasKeluar) => {
      if (err) throw err;

      let saldo = resultKasMasuk[0].totalKasMasuk - resultKasKeluar[0].totalKasKeluar;

      res.render('index', {
        kasMasuk: resultKasMasuk[0].totalKasMasuk,
        kasKeluar: resultKasKeluar[0].totalKasKeluar,
        saldo: saldo
      });
    });
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
