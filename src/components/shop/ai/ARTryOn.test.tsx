// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ARTryOn } from './ARTryOn'

describe('ARTryOn', () => {
  let originalMediaDevices: any

  beforeEach(() => {
    originalMediaDevices = global.navigator.mediaDevices

    // Mock navigator.mediaDevices
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: vi.fn().mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }]
          })
        },
        configurable: true
      })
    }
  })

  afterEach(() => {
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        configurable: true
      })
    }
  })

  it('should render the AR Try-On trigger button', () => {
    render(<ARTryOn />)
    const buttons = screen.getAllByText('AR Try-On')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should open dialog and start camera on click', async () => {
    render(<ARTryOn />)
    const button = screen.getAllByText('AR Try-On')[0]
    fireEvent.click(button)

    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'user' }
      })
    })

    const titles = screen.getAllByText('Virtual Try-On')
    expect(titles.length).toBeGreaterThan(0)
  })
})
