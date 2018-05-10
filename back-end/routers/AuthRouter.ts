import * as express from 'express';
import { Service, Express } from '../module';

export class AuthRouter {
    constructor(private authService: Service.IAuthService) {
        this.authService = authService;
    }
    
    public router() {
        let router = express.Router();
        router.post('/google', this.googleLogin.bind(this));
        router.post('/jwt', this.jwtLogin.bind(this));
        return router;
    }
    
    public googleLogin(req: Express.reqBody<{ code: string }>, res: express.Response) {
        return this.authService.googleLogin(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }

    public jwtLogin(req: Express.reqHeaders<{ authorization: string }>, res: express.Response) {
        return this.authService.jwtLogin(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }
}