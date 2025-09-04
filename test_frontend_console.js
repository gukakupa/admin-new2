const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`[PAGE ERROR] ${error.message}`);
    });
    
    // Navigate to the website
    console.log('Navigating to website...');
    await page.goto('https://geosite-launch.preview.emergentagent.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Check if sections are present
    const sections = await page.evaluate(() => {
      const sectionIds = ['services', 'testimonials', 'contact', 'service-request'];
      const results = {};
      
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        results[id] = {
          exists: !!element,
          visible: element ? element.offsetHeight > 0 : false,
          content: element ? element.textContent.substring(0, 100) : null
        };
      });
      
      return results;
    });
    
    console.log('\n=== SECTION CHECK RESULTS ===');
    Object.entries(sections).forEach(([id, info]) => {
      console.log(`${id}: exists=${info.exists}, visible=${info.visible}`);
      if (info.content) {
        console.log(`  Content preview: ${info.content}...`);
      }
    });
    
    // Check for React errors
    const reactErrors = await page.evaluate(() => {
      return window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ || null;
    });
    
    if (reactErrors) {
      console.log('\n=== REACT ERRORS DETECTED ===');
      console.log(reactErrors);
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();