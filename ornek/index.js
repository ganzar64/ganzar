const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require('express');
const engines = require('consolidate');
const cors = require('cors')({ origin: true });


const firebaseApp = firebase.initializeApp(functions.config().firebase);

const db = firebase.firestore();

const gmailEmail = 'itageltd@gmail.com'//functions.config().gmail.email;
const gmailPassword = 'Itage2018'; //functions.config().gmail.password;//'Itage2018';

/*
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: 'true',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});*/

let transporter = nodemailer.createTransport({

  host: 'smtp.strato.de',
  port: 465,
  secure: true,
  auth: {
    user: 'fatih@it-age.net',
    pass: 'abcd'
  }

});

const app = express();

app.engine('html', engines.handlebars);

app.set('views', './views');

app.set('view engine', 'html');

function getPartials() {
  var partials = {
    menu: './partials/menu',
    head: './partials/head',
    footer: './partials/footer',
    foot: './partials/foot',
    indexhead: './partials/indexhead',
    indexfooter: './partials/indexfooter',
    inspectioncontent: './partials/inspectioncontent'
  };

  return partials;
}

app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getPageData('index').then((obj) => {
    res.render('genericpage1', obj);
    return;
  }).catch(error => {
    res.render('404', { partials: getPartials() });
  });
});

app.get('/test-index', (req, res) => {
  getPageData('index').then((obj) => {
    res.render('inspectionindex', obj);
    return;
  }).catch(error => {
    res.render('404', { partials: getPartials() });
  });

});

app.post('/subscribe2newsletter', (req, res) => {

  const mailOpts = {
    from: 'info@it-age.net', // This is ignored by Gmail
    to: 'suleyman@it-age.net',
    bcc: 'yusuf@it-age.net',
    subject: 'ITAGE Net Contact Request',
    text: `(${req.body.email}) says: Subscribe me to newsletter please.`
  }

  const FieldValue = firebase.firestore.FieldValue;
  const docRef = db.collection('newslettersubscribers').doc(req.body.email);
  docRef.set({
    first: req.body.email,
    timestamp: FieldValue.serverTimestamp()
  });

  // Attempt to send the email
  transporter.sendMail(mailOpts, (error, response) => {
    if (error) {

      getPageData('subscribe-fail').then((obj) => {
        res.render('genericpage1', obj);
        return;
      }).catch(error => {
        res.render('404', { partials: getPartials() });
      });
    }
    else {
      getPageData('subscribe-success').then((obj) => {
        res.render('genericpage1', obj);
        return;
      }).catch(error => {
        res.render('404', { partials: getPartials() });
      });
    }
  })
});


app.get('/inspectionmachines/index.html', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

  const docRef = db.collection('pages').doc('inspectionindex');
  docRef.get().then((obj) => {
    var pg = obj.data();
    pg.partials = getPartials();
    res.render('inspectionindex', pg);
    return;
  }).catch(error => {
    res.render('404', { partials: getPartials() });
  });
});

app.get('/api', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.json({ bongs: 'BONG '.repeat(hours) });
});

app.get('/db-test', (req, res) => {
  const FieldValue = firebase.firestore.FieldValue;
  const docRef = db.collection('testusers').doc('alovelace');
  docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815,
    timestamp: FieldValue.serverTimestamp()
  });

  res.render('kivanc', { firstname: 'İşlem', lastname: 'Tamamlandı', partials: getPartials() });
});



app.get('/db-test-read', (req, res) => {
  const FieldValue = firebase.firestore.FieldValue;
  const docRef = db.collection('testusers').doc('alovelace');
  docRef.get().then((obj) => {
    res.json(obj).data();
    return;
  }).catch(error => {
    res.json({ status: 'NOK' })
  });


});

app.get('/db-test-read-2', (req, res) => {
  const FieldValue = firebase.firestore.FieldValue;
  const docRef = db.collection('testusers').doc('alovelace');
  docRef.get().then((obj) => {
    res.json(obj.data());
    return;
  }).catch(error => {
    res.json({ status: 'NOK' })
  });


});


app.get('/db-test-read-3', (req, res) => {
  var pg = getPageData('index');

  res.json(pg);

});


app.get('/db-test-read-4', (req, res) => {
  const FieldValue = firebase.firestore.FieldValue;
  const docRef = db.collection('pages').doc('index');
  docRef.get().then((obj) => {
    res.json(obj.data());
    return;
  }).catch(error => {
    res.json({ status: 'NOK' })
  });

});


app.get('/db-test-read-5', (req, res) => {
  getPageData('index').then((obj) => {
    res.json(obj);
    return;
  }).catch(error => {
    res.json({ status: 'NOK', err: error })
  });

});

app.get('/db-test-read-6', (req, res) => {
  getPageData('index').then((obj) => {
    res.json(obj);
    return;
  }).catch(error => {
    res.json({ status: 'NOK', err: error })
  });

});

app.get('/contact-itage', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('contact', { partials: getPartials() });
});

app.post('/contact', (req, res) => {
  // Instantiate the SMTP server
  /*
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    }
  })*/

  // Specify what the email will look like
  const mailOpts = {
    from: 'info@it-age.net', // This is ignored by Gmail
    to: 'suleyman@it-age.net',
    bcc: 'yusuf@it-age.net',
    subject: 'ITAGE Net Contact Request',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

  // Attempt to send the email
  transporter.sendMail(mailOpts, (error, response) => {
    if (error) {

      getPageData('contact-fail').then((obj) => {
        res.render('genericpage1', obj);
        //res.status(201).send(obj.content);
        return;
      }).catch(error => {
        res.render('404', { partials: getPartials() });
      });
    }
    else {
      getPageData('contact-success').then((obj) => {
        res.render('genericpage1', obj);
        //res.status(201).send(obj.content);
        return;
      }).catch(error => {
        res.render('404', { partials: getPartials() });
      });
    }
  })
});


app.get('/:page', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

  if ('undefined' !== typeof req.params.page && req.params.page) {
    var pagehtml = req.params.page;

    var pgs = pagehtml.split(".");

    getPageData(pgs[0]).then((obj) => {
      if(obj!==null){
        res.render('genericpage1', obj);
        
      }else{
        res.render('404', { partials: getPartials() });
      }
      return;
    }).catch(error => {
      res.render('404', { partials: getPartials() });
    });

  } else {
    res.render('404', { partials: getPartials() });
    return;
  }

});


app.get('*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000');
  res.render('404', { partials: getPartials() });
});

function render404page(res){
  getPageData('404').then((obj) => {
    if(obj!==null){
      res.render('genericpage1', obj);
      
    }else{
      res.render('404', { partials: getPartials() });
    }
    return;
  }).catch(error => {
    res.render('404', { partials: getPartials() });
  });
}

const getPageData = async function getPageData(pagename) {


  const menuref = db.collection('menus').doc('mainmenu');

  const menuobj = await menuref.get();
  menu = { content: 'Not Found' };
  if (menuobj.exists) {
    menu = menuobj.data();
  }

  const footerref = db.collection('footers').doc('mainfooter');

  const footerobj = await footerref.get();

  footer = { content: 'Not Found' };
  if (footerobj.exists) {
    footer = footerobj.data();
  }


  const sidebarref = db.collection('sidebars').doc('mainsidebar');

  const sidebarobj = await sidebarref.get();

  sidebar = { content: 'Not Found' };
  if (sidebarobj.exists) {
    sidebar = sidebarobj.data();
  }

  const docRef = db.collection('pages').doc(pagename);

  const doc = await docRef.get();



  if (!doc.exists) {
    return null;
    // return doc;
  } else {
    let pg = doc.data();

    pg.partials = getPartials();
    pg.menu = menu;
    pg.footer = footer;
    pg.sidebar = sidebar;
    return pg;
  }

}






exports.app = functions.https.onRequest(app);