axios.get('/api/hello')
     .then(resp => {
         console.log(resp);
         $('#h1').text('Hello ' + resp.data.hello);
     })
     .catch(err => console.log(err))
     .then(() => console.log('finished.'));