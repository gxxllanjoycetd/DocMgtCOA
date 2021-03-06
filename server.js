const express = require('express');
const app = express();

app.use(express.static('server'));

app.listen(3000, function() {
    console.log('Server is running on port 3000')
})

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./jevrecord.db', (err) => {
    if (err) {
        console.log(error.message)
    }
    console.log('connected to jevrecord db in sqlite');
});
// --------------- create table --------------
db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS jev_test ( 
        [jev_id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        [jev_num] TEXT(100) NOT NULL, 
        [check_num] TEXT(100) NOT NULL, 
        [amount] TEXT(100) NOT NULL, 
        [status] TEXT(100) NOT NULL, 
        [voucher_num] TEXT(100) NOT NULL, 
        [voucher_date] date NOT NULL, 
        [payee] TEXT(100) NOT NULL, 
        [source_fund] TEXT(100) NOT NULL, 
        [transaction_type] TEXT(100) NOT NULL, 
        [sub_doc] TEXT(100) NOT NULL, 
        [unsub_doc] TEXT(100) NOT NULL,
        [own_url] TEXT(100) NOT NULL)`);
});
//-------------- create checklists table -------------
db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS checklists ( 
        [check_id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        [title] TEXT(100) NOT NULL,                
        [own_url] TEXT(100),
        [jev_id] TEXT(100) )`);
});
//------------- insert record --------------
app.get('/insert_record', (req, res) => {
    console.log("req=====>", req.query.own_url);
    query = `INSERT INTO jev_test ( jev_num, check_num ,amount ,status ,voucher_num ,voucher_date ,payee ,source_fund ,transaction_type ,sub_doc ,unsub_doc,own_url ) VALUES 
    ( '` + req.query.jev_num + `' ,'` + req.query.check_num + `' ,'` + req.query.amount + `' ,'` + req.query.status + `' ,'` + req.query.voucher_num + `' ,'` + req.query.voucher_date + `' ,'` + req.query.payee + `' ,'` + req.query.source_fund + `' ,'` + req.query.transaction_type + `' ,'` + req.query.sub_doc + `' ,'` + req.query.unsub_doc + `','` + req.query.own_url + `')`;
    db.run(
        query,
        function(err, row) {
            retString = getStringfromDb();
            res.status(200).send({ status: 1 });
        }
    );

});

//-------------get update data ---------
app.get('/update_record/:id', (req, res) => {
    const jev_id = req.params.id;
    var query = 'SELECT * FROM jev_test WHERE jev_id = ' + jev_id;
    db.all(query, function(err, row) {
        if (err) {
            console.log("can not update")
        } else if (row) {
            res.send({ res: row })
        }
    })
});

//-------------real update record ---------
app.get('/realupdate_record/', (req, res) => {
    //console.log(req.params)
    var query = `UPDATE jev_test SET jev_num = '` + req.query.jev_num + `', check_num = '` + req.query.check_num + `', amount = '` + req.query.amount + `', status = '` + req.query.status + `', voucher_num = '` + req.query.voucher_num + `', voucher_date = '` + req.query.voucher_date + `', payee = '` + req.query.payee + `', source_fund = '` + req.query.source_fund + `', transaction_type = '` + req.query.transaction_type + `', sub_doc = '` + req.query.sub_doc + `', unsub_doc = '` + req.query.unsub_doc + `', own_url = '` + req.query.own_url + `'
                WHERE  jev_id = '` + req.query.jev_id + `' ;`
    console.log(query)
    db.run(query, function(err, row) {
        if (err) {
            console.log("can not update")
        } else {
            retString = getStringfromDb();
            console.log("update success")
            res.send({ res: 1 })
        }
    })
});
//-------------- delete record --------------
app.get('/delete_record/:id', (req, res) => {
    const jev_id = req.params.id;
    var query = 'DELETE FROM jev_test WHERE jev_id=' + jev_id;
    db.run(query, function(err) {
        if (err) {
            console.log("can not delete")
        } else {
            retString = getStringfromDb();
            res.send("delete success")
        }
    })
});
//------------- generate report data ---------
app.get('/generate_report/:id', (req, res) => {
    const jev_id = req.params.id;
    var query = 'SELECT * FROM jev_test WHERE jev_id = ' + jev_id;
    db.all(query, function(err, row) {
        if (err) {
            console.log("can not generate")
        } else if (row) {
            res.send({ res: row })
        }
    })
});

//-------------get checklists data ---------
app.get('/read_check', (req, res) => {
    const own_url = req.query.own_url;
    const jev_id = req.query.jev_id;
    var query = 'SELECT * FROM checklists WHERE own_url = ' + '"' + own_url + '" AND jev_id = ' + '"' + jev_id + '"';
    db.all(query, function(err, rows) {
        if (err) {
            console.log("can not read")
        } else if (rows) {
            retStr = '';
            for (i = 0; i < rows.length; i++) {
                retStr += '<li>';
                retStr += rows[i]['title'];
                retStr += '<input style="align-text:right;" type="checkbox" value="' + rows[i].check_id + '"/></li>';
            }
            res.send({ res: retStr })
        }
    })
});

//------------- insert checklists --------------
app.get('/add_check', (req, res) => {
    query = `INSERT INTO checklists ( title,own_url,jev_id ) VALUES 
            ( '` + req.query.title + `' ,'` + req.query.own_url + `','` + req.query.jev_id + `')`;
    db.run(query, function(err, row) {
        if (err) {
            console.log("fail to insert check");
        } else {
            res.send({ status: 1 });
        }
    });

});
//-------------- delete checklists --------------
app.get('/remove_checklist', (req, res) => {
    const check_id = req.query.id;
    del_id = check_id[0];
    var query = 'DELETE FROM checklists WHERE check_id=' + del_id;
    db.run(query, function(err) {
        if (err) {
            console.log("can not delete")
        } else {
            retString = getStringfromDb();
            res.send("delete success")
        }
    })
});


//------------- get table data ----------------
var retString = '';
var i = 0;
app.get('/getTable', (req, res) => {

    retString = getStringfromDb();
    res.send({ res: retString });
});

function getStringfromDb() {
    db.all(`SELECT * FROM jev_test`, (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        retString = '';
        for (i = 0; i < rows.length; i++) {
            retString +=
                `<tr id = ` + rows[i].jev_id + `>
                <td style="width: 2%; text-align: center"><input type="checkbox" value="` + rows[i].jev_id + `"></td>
                <td style="width: 5%; text-align: center">` + rows[i].jev_num + `</td>
                <td style="width: 5%; text-align: center">` + rows[i].check_num + `</td>
                <td style="width: 5%; text-align: center">` + rows[i].amount + `</td>
                <td style="width: 5%; text-align: center">` + rows[i].status + `</td>
                <td style="width: 5%; text-align: center">` + rows[i].voucher_num + `</td>
                <td style="width: 8%; text-align: center">` + rows[i].voucher_date + `</td>
                <td style="width: 5%; text-align: center">` + rows[i].payee + `</td>
                <td style="width: 13%; text-align: center">` + rows[i].source_fund + `</td>
                <td style="width: 36%; text-align: center">` + rows[i].transaction_type + `</td>
                <td style="display:none; width: 0%; text-align: center">` + rows[i].sub_doc + '/' + rows[i].unsub_doc + `</td>
                
            </tr>`
        }
    });

    return retString;


}