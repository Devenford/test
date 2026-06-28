const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3002/api/testing/reset')
    await request.post('http://localhost:3002/api/users', {
      data: {
        "username": "neil123",
        "name": "Neil Tyson",
        "password": "password12345"
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    // the 2 lines above can be performed in a single line, without the auxiliary variable "locator"
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('neil123')
    await page.getByLabel('password').fill('password12345')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Neil Tyson logged in'))
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('neil123')
      await page.getByLabel('password').fill('password12345')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make unimportant' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})