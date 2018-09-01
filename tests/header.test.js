jest.setTimeout(200000);

// const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory    = require('./factories/userFactory');
const Page           = require('./helpers/page');
	

	var page = '';


beforeEach(async () => {

	 // page = await Page.build();	  
	 
	 // await page.goto('localhost:3000');

});


afterEach( async () => {
	
	// await page.close();

});

test('the header has the correct text', async () => {

	page = await Page.build();	  
	
	await page.goto('http://localhost:3000');
	


	// const text = await page.$eval('a.brand-logo', el => el.innerHTML);

	const text = await page.getContentsOf('a.brand-logo');

	expect(text).toEqual('Blogster');
	
});


test('clicking login starts oauth flow', async () => {

	page = await Page.build();	  
	
	await page.goto('localhost:3000');
	await page.click('.right a');

	const url = await page.url();


	expect(url).toMatch(/accounts\.google\.com/);


});


test('when signed in, show logout button', async (done) => {

	page = await Page.build();	  
	
	await page.goto('localhost:3000');



	// const	browser = await puppeteer.launch({
	// 		headless: false
	// 	});
	
	// const	page = await browser.newPage();

	//         await page.goto('localhost:3000');
	
	
		await page.login();

		const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

		expect(text).toEqual('Logout');

		done();

		
		
}, 100000);