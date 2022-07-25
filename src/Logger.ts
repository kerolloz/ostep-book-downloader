import Spinnies from 'spinnies';

export default class Logger {
  private static spinnies: Spinnies = new Spinnies({ succeedPrefix: '[ ✔ ]', failPrefix: '[ ✖ ]' });

  public static log(event: string, message?: string): void {
    this.spinnies.add(event, { text: message });
  }

  public static success(event: string, message?: string): void {
    if (!this.spinnies.pick(event)) this.log(event, message);
    this.spinnies.succeed(event, { text: message });
  }

  public static fail(event: string, message?: string): void {
    if (!this.spinnies.pick(event)) this.log(event, message);
    this.spinnies.fail(event, { text: message });
  }
}
