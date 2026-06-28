import { test, describe, expect, beforeEach } from '@playwright/test'
import { loginWith, createNote } from './helper'

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        "username": "neil123",
        "name": "Neil Tyson",
        "password": "password12345"
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    // the 2 lines above can be performed in a single line, without the auxiliary variable "locator"
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'neil123', 'password12345')
    await expect(page.getByText('Neil Tyson logged in'))
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'neil123', 'wrongpassword')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Neil Tyson logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'neil123', 'password12345')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made unimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
        
        await otherNoteElement.getByRole('button', { name: 'make unimportant' }).click()

        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})