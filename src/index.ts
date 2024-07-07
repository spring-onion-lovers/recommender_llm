import app from './app';

import config from './config/default'
import { initPinecone } from './utils/pineconeClient';

const PORT = config.PORT || 3010;

(async () => {
    try{
        await initPinecone();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }catch(err){
        console.log(err);
    }
})();