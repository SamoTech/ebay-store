/**
 * Newsletter API Route Tests
 * Tests for /api/newsletter/subscribe endpoint
 */

import { POST, GET } from '@/app/api/newsletter/subscribe/route';
import { NextRequest } from 'next/server';

// Mock environment variables
process.env.WEB3FORMS_ACCESS_KEY = 'test_access_key_123';

// Mock fetch globally
global.fetch = jest.fn();

describe('/api/newsletter/subscribe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    describe('Validation', () => {
      test('returns 400 when name is missing', async () => {
        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            message: 'Test message',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Name');
      });

      test('returns 400 when email is missing', async () => {
        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            message: 'Test message',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('Email');
      });

      test('returns 400 for invalid email format', async () => {
        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'invalid-email',
            message: 'Test message',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('valid email');
      });

      test('returns 400 for name too short', async () => {
        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'A',
            email: 'test@example.com',
            message: 'Test message',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toContain('2 and 100 characters');
      });

      test('sanitizes HTML in inputs', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John <script>alert("xss")</script> Doe',
            email: 'test@example.com',
            message: '<b>Test</b> message',
          }),
        });

        await POST(request);

        // Check that fetch was called with sanitized data
        const fetchCall = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);
        expect(requestBody.name).not.toContain('<script>');
        expect(requestBody.message).not.toContain('<b>');
      });
    });

    describe('Success Cases', () => {
      test('successfully subscribes with valid data', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, message: 'Subscribed!' }),
        });

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'I want to subscribe',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.email).toBe('john@example.com');
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.web3forms.com/submit',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });

      test('uses default message when not provided', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
          }),
        });

        await POST(request);

        const fetchCall = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);
        expect(requestBody.message).toContain('DealsHub');
      });

      test('converts email to lowercase', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'JOHN@EXAMPLE.COM',
            message: 'Test',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(data.email).toBe('john@example.com');
      });
    });

    describe('Error Handling', () => {
      test('handles Web3Forms API errors', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({ success: false, message: 'API error' }),
        });

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Test',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBeTruthy();
      });

      test('handles network errors', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Test',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
      });

      test('handles invalid JSON', async () => {
        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: 'invalid json',
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
      });

      test('returns 500 when API key is missing', async () => {
        const originalKey = process.env.WEB3FORMS_ACCESS_KEY;
        delete process.env.WEB3FORMS_ACCESS_KEY;

        const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Test',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toContain('configuration');

        // Restore
        process.env.WEB3FORMS_ACCESS_KEY = originalKey;
      });
    });
  });

  describe('GET (Health Check)', () => {
    test('returns health status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.endpoint).toBe('/api/newsletter/subscribe');
      expect(data.methods).toContain('POST');
    });
  });
});
