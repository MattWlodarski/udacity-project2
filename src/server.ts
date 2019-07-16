import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response) => {
    // 1. validate image_url query
    const { image_url }: { image_url: string } = req.query;

    if (!image_url) {
      return res.status(400).send('Image Url is required');
    }

    //2. call filterImageFromURL(image_url) to filter the image
    const imgPath: string = await filterImageFromURL(image_url);
    // 3. send the resulting file in the response
    await res.sendFile(imgPath, (err: Error) => {
      if (err) {
        console.log(err);
      }
      // 4. deletes any files on the server on finish of the response
      deleteLocalFiles([imgPath]);
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();