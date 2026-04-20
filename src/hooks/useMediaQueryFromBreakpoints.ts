import type { MantineBreakpoint } from '@mantine/core'
import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

type useMediaQueryFromBreakpointsParams = (
  breakpoint?: MantineBreakpoint,
  query?: 'max-width' | 'min-width'
) => boolean

export const useMediaQueryFromBreakpoints: useMediaQueryFromBreakpointsParams = (
  breakpoint = 'sm',
  query = 'max-width'
) => {
  const theme = useMantineTheme()
  const bool = useMediaQuery(`(${query}: ${theme.breakpoints[breakpoint]})`, undefined, {
    getInitialValueInEffect: false
  })

  return bool
}
