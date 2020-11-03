import head from "lodash/head";

import DB from "../db/db";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../components/notifier";

import EventManager from "./messenger";

const QUEUE_ADD = "queue-add";
const QUEUE_FINISHED = "queue-finished";
const QUEUE_FAILED = "queue-failed";
const QUEUE_SKIP = "queue-skip";
const QUEUE_SUCCESS = "queue-success";

class Queue {
  constructor() {
    this.queue = [];
    this.success = 0;
    this.tries = 0;
    this.working = false;

    EventManager.subscribe(QUEUE_ADD, action => {
      this.add([action]);
    });

    EventManager.subscribe(QUEUE_SKIP, () => {
      this.tries = 0;
      this.queue.shift();

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_SUCCESS, () => {
      this.success += 1;
    });

    EventManager.subscribe(QUEUE_FAILED, () => {
      this.tries += 1;

      if (this.tries === 3) {
        this.queue.shift();
        this.tries = 0;
      }

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_FINISHED, id => {
      this.finished(id);
    });

    this.fromDB();

    return Queue.instance;
  }

  async fromDB() {
    const offlineRequests = (await DB.getAll("offline_requests")) || [];

    this.add(offlineRequests);
  }

  start() {
    if (!this.working) this.process();
  }

  add(actions) {
    this.queue = actions;

    if (!this.working) {
      this.process();
    }
  }

  finished() {
    this.queue.shift();

    if (!this.working) this.process();

    if (!this.queue.length) {
      this.notifySuccess();
      this.success = 0;
    }
  }

  process() {
    if (this.ready) {
      this.working = true;

      const item = head(this.queue);

      if (item) {
        const action = item;

        this.dispatch(action);
      }

      this.working = false;
    }
  }

  notifySuccess() {
    if (this.success) {
      this.dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "sync.success",
          messageParams: { records: this.success },
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: "sync_success"
          }
        }
      });
    }
  }

  hasWork() {
    return Boolean(this.queue.length);
  }
}

const instance = new Queue();

export default instance;

export { QUEUE_ADD, QUEUE_FINISHED, QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS };
