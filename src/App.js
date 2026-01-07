import OnCallController from './controller/OnCallController.js';

class App {
  async run() {
    const controller = new OnCallController();
    await controller.run();
  }
}

export default App;
