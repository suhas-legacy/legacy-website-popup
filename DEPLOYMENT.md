# Deployment Guide

This guide covers both Docker and Vercel deployment options for the Legacy Website Popup application.

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured in `.env` file

### Local Development

1. **Build and run with Docker Compose:**
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your actual API keys
nano .env

# Build and run the application
docker-compose up --build
```

2. **Access the application:**
- Application: http://localhost:3000
- With Nginx proxy: http://localhost (if using production profile)

### Production Deployment

1. **Production Docker Compose:**
```bash
# Run with Nginx reverse proxy
docker-compose --profile production up -d
```

2. **Manual Docker Build:**
```bash
# Build the image
docker build -t legacy-website-popup .

# Run the container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e FINNHUB_API_KEY=your_key \
  legacy-website-popup
```

### CI/CD with GitHub Actions

The GitHub Actions workflow automatically:
1. Runs tests and linting
2. Builds Docker image
3. Pushes to GitHub Container Registry
4. Deploys to staging/production environments

**Required GitHub Secrets:**
- `GITHUB_TOKEN` (automatically provided)
- Additional secrets for your deployment target

**Image Tags:**
- `ghcr.io/your-org/legacy-website-popup:main` - latest main branch
- `ghcr.io/your-org/legacy-website-popup:develop` - latest develop branch
- `ghcr.io/your-org/legacy-website-popup:main-{sha}` - specific commit

## Vercel Deployment

### Prerequisites
- Vercel account
- Vercel CLI (optional for local deployment)

### Automatic Deployment

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure Environment Variables:**
   In Vercel dashboard, add these environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app
   FINNHUB_API_KEY=your_FINNHUB_API_KEY
   NEXT_PUBLIC_SITE_URL=https://legacyglobalbank.com
   ```

3. **Deploy:**
   - Push to `main` branch → Production deployment
   - Push to `develop` branch → Preview deployment
   - Create Pull Request → Preview deployment

### Manual Deployment with Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login and Deploy:**
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### CI/CD with GitHub Actions

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - Get from Vercel Account Settings
- `VERCEL_ORG_ID` - Get from Vercel dashboard
- `VERCEL_PROJECT_ID` - Get from project settings

**Deployment Workflow:**
- `main` branch → Production deployment
- `develop` branch → Preview deployment
- Pull Requests → Preview deployments

## Environment Variables

### Required Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
FINNHUB_API_KEY=your_FINNHUB_API_KEY_here
NEXT_PUBLIC_API_URL=https://legacy-backend-151726525663.europe-west1.run.app  # or your production API URL
NEXT_PUBLIC_SITE_URL=https://legacyglobalbank.com
```

### Optional Variables
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## SSL/HTTPS Setup (Docker)

### Using Nginx with SSL

1. **Obtain SSL certificates:**
```bash
# Using Let's Encrypt with certbot
sudo certbot certonly --standalone -d your-domain.com
```

2. **Update nginx.conf:**
   - Uncomment the HTTPS server block
   - Update `server_name` to your domain
   - Ensure SSL certificate paths are correct

3. **Mount SSL certificates:**
```bash
docker-compose --profile production up -d \
  -v /etc/letsencrypt:/etc/nginx/ssl:ro
```

## Monitoring and Scaling

### Docker Monitoring
```bash
# View logs
docker-compose logs -f

# Monitor resource usage
docker stats

# Scale the application
docker-compose up -d --scale app=3
```

### Vercel Monitoring
- Built-in analytics in Vercel dashboard
- Real-time logs and error tracking
- Performance metrics
- Automatic scaling included

## Troubleshooting

### Docker Issues
- **Build fails:** Check Node.js version compatibility
- **Container won't start:** Verify environment variables
- **Port conflicts:** Ensure ports 3000/80/443 are available

### Vercel Issues
- **Build fails:** Check `vercel.json` configuration
- **API errors:** Verify environment variables in Vercel dashboard
- **Deployment timeouts:** Check function duration limits in `vercel.json`

## Performance Optimization

### Docker Optimizations
- Multi-stage builds reduce image size
- Nginx reverse proxy for static assets
- Container orchestration for scaling

### Vercel Optimizations
- Edge functions for global distribution
- Automatic code splitting
- Built-in CDN
- Image optimization

## Security Considerations

- Store API keys in environment variables, never in code
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security updates for dependencies
- Monitor for security vulnerabilities
