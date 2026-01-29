import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./components/register/register";
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Project');

}
