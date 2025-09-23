import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'func-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './func-header.html',
  styleUrls: ['./func-header.css'],
})
export class FuncHeader {}
