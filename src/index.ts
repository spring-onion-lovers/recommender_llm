import app from './app';

import config from './config/default'

const PORT = config.PORT || 3010;

(async () => {
    try{
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }catch(err){
        console.log(err);
    }
})();