import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../../../app/shared/global-services/post.service';
import { ToastService } from '../../../../shared/global-services/toast.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private toastService: ToastService
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}
  
  async onSubmit(): Promise<void> {
    if (this.postForm.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    try {
      const { content } = this.postForm.value;
      await this.postService.createPost(content);
      
      this.toastService.show('Post created successfully', 'success');
      this.postForm.reset();
      this.closeModal();
    } catch (error) {
      console.error('Error creating post:', error);
      this.toastService.show('Failed to create post. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
  
  closeModal(): void {
    // This would close the modal if you're using one
    // Emit an event or call a service method
  }
}