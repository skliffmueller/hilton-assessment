import Server from './server'
import * as next from 'next';

const app = next({ dev: true });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = new Server(handle);
  server.app.listen(port, (err: any) => {
    if (err) {
      return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
  });
});


export default app;