import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class FeedbackForm extends LitElement {

  @property({ type: String }) url = 'http://localhost:4000/api/feedbacks';
  @property({ type: Boolean }) displaySuccess = false;
  @property({ type: Boolean }) displayForm = false;

  openFeedback(e: Event) { this.displayForm = true; }

  static styles = css`
    input, textarea {
      display: block;
    }
    * {
      font-family: Arial;
    }
  `;

  async submitFeedback(event: Event) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data: { [k: string]: any } = {};
    formData.forEach((value, key) => (data[key] = value))
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    console.log(response);
    this.displayForm = false;
    this.displaySuccess = true;
  }

  render() {
    return html`
      ${this.displayForm ? html`
        <slot name="form">
          <form @submit=${this.submitFeedback} part="form">
            <div part="name-input-group">
              <label>Name</label>
              <input name="name" part="input"></input>
            </div>
            <div part="email-input-group">
              <label>Email</label>
              <input name="email" part="input"></input>
            </div>
            <div part="textarea-input-group">
              <label>Message</label>
              <textarea name="message" part="input"></textarea>
            </div>
            <button part="submit-button">Send Feedback</button>
          </form>
        </slot>
      ` : html`
        <button @click=${this.openFeedback} part="open-feedback-button" slot="open-feedback">Feedback!</button>
      `}
      ${this.displaySuccess ? html`
        <slot name="success"><h1>Great job!</h1></slot>
      ` : ''}
    `;
  }
}
