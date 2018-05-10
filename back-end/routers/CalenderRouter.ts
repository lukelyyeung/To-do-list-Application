import { Service } from "../module";
import * as express from 'express';

export class CalendarRouter {
    constructor(private calendarService: Service.ICalendarService){
        this.calendarService = calendarService;
    }

    public router() {
        let router = express.Router();
        router.get('/:calendarId/list', this.getList.bind(this));
        router.get('/:calendarId/events/:eventId', this.get.bind(this));
        router.patch('/:calendarId/events/:eventId', this.patch.bind(this));
        router.delete('/:calendarId/events/:eventId', this.delete.bind(this));
        router.post('/:calendarId', this.post.bind(this));
        return router;
    }

    public getList(req: express.Request, res: express.Response) {
        return this.calendarService.listEvent(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }

    public get(req: express.Request, res: express.Response) {
        return this.calendarService.getEvent(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }

    public post(req: express.Request, res: express.Response) {
        return this.calendarService.createEvent(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }
    public patch(req: express.Request, res: express.Response) {
        return this.calendarService.updateEvent(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }
    public delete(req: express.Request, res: express.Response) {
        return this.calendarService.removeEvent(req)
            .then(response => res.status(200).json(response))
            .catch(err => res.json({ error: err.message }));
    }
}