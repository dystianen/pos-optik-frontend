'use client'
import { useMemo } from 'react'
import {
  Box,
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Tabs,
  UnstyledButton,
  ScrollArea,
  Skeleton,
  ThemeIcon
} from '@mantine/core'
import { IconTruck, IconCheck, IconClock } from '@tabler/icons-react'
import Image from 'next/image'

interface ShippingOption {
  courier: string
  courier_name: string
  service: string
  description: string
  etd: string
  cost: number
}

interface CourierSelectorProps {
  options: ShippingOption[]
  selectedCourier: string
  selectedService: string
  isLoading?: boolean
  onChange: (courier: string, service: string) => void
}

/** Map courier code → logo URL atau emoji fallback */
const COURIER_LOGOS: Record<string, string> = {
  jne: 'https://cdn.adefoodwaste.biz.id/jne.svg',
  pos: 'https://cdn.adefoodwaste.biz.id/pos.svg',
  tiki: 'https://cdn.adefoodwaste.biz.id/tiki.svg',
  jnt: 'https://cdn.adefoodwaste.biz.id/jnt.svg',
  sicepat: 'https://cdn.adefoodwaste.biz.id/sicepat.svg',
}

/** Warna badge per service type */
function getServiceBadgeColor(service: string): string {
  const s = service.toLowerCase()
  if (s.includes('next') || s.includes('same') || s.includes('yes')) return 'red'
  if (s.includes('express') || s.includes('exp') || s.includes('oke')) return 'orange'
  if (s.includes('eco') || s.includes('economy')) return 'green'
  if (s.includes('cargo') || s.includes('truck') || s.includes('jtr')) return 'gray'
  return 'blue'
}

function getServiceLabel(service: string): string {
  const s = service.toLowerCase()
  if (s.includes('next') || s.includes('same') || s.includes('yes')) return 'Same Day'
  if (s.includes('express') || s.includes('exp')) return 'Express'
  if (s.includes('eco') || s.includes('economy')) return 'Economy'
  if (s.includes('cargo') || s.includes('truck') || s.includes('jtr')) return 'Cargo'
  if (s === 'reg' || s.includes('regular') || s.includes('reguler')) return 'Regular'
  return service
}

export default function CourierSelector({
  options,
  selectedCourier,
  selectedService,
  isLoading,
  onChange,
}: CourierSelectorProps) {
  // Group options by courier
  const grouped = useMemo(() => {
    const map: Record<string, { name: string; services: ShippingOption[] }> = {}
    options.forEach((opt) => {
      if (!map[opt.courier]) {
        map[opt.courier] = { name: opt.courier.split(' (')[0].split(' -')[0].toUpperCase(), services: [] }
      }
      map[opt.courier].services.push(opt)
    })
    return map
  }, [options])

  const courierKeys = Object.keys(grouped)
  const activeTab = courierKeys.includes(selectedCourier) ? selectedCourier : courierKeys[0] ?? ''

  const handleTabChange = (val: string | null) => {
    if (!val) return
    const firstService = grouped[val]?.services[0]
    if (firstService) {
      onChange(firstService.courier, firstService.service)
    }
  }

  if (isLoading) {
    return (
      <Stack gap="sm">
        <Group gap="sm">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h={48} w={100} radius="md" />
          ))}
        </Group>
        <Stack gap="xs">
          {[1, 2].map((i) => (
            <Skeleton key={i} h={72} radius="md" />
          ))}
        </Stack>
      </Stack>
    )
  }

  if (!options.length) return null

  return (
    <Stack gap="sm">
      {/* ── Courier brand tabs ── */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="pills"
        styles={{
          root: { width: '100%' },
          tab: {
            border: '1.5px solid var(--mantine-color-default-border)',
            borderRadius: 10,
            padding: '6px 14px',
            height: 52,
            minWidth: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            transition: 'all 0.15s ease',
          },
        }}
      >
        <ScrollArea scrollbarSize={0} type="scroll">
          <Tabs.List style={{ flexWrap: 'wrap', gap: 8 }}>
            {courierKeys.map((key) => {
              const logoUrl = COURIER_LOGOS[key.toLowerCase()]
              const isActive = activeTab === key
              return (
                <Tabs.Tab
                  key={key}
                  value={key}
                  style={{
                    borderColor: isActive ? 'var(--mantine-color-blue-6)' : undefined,
                    backgroundColor: isActive ? 'var(--mantine-color-blue-0)' : undefined,
                  }}
                  styles={{
                    tabLabel: {
                      display: "flex",
                      alignItems: "center"
                    }
                  }}
                >
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image
                      src={logoUrl}
                      alt={grouped[key].name}
                      width={60}
                      height={60}
                      style={{ objectFit: 'contain', color: 'transparent' }}
                      onError={(e) => {
                        ; (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <ThemeIcon size="xs" variant="transparent" color={isActive ? 'blue' : 'gray'}>
                      <IconTruck size={14} />
                    </ThemeIcon>
                  )}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </ScrollArea>

        {/* ── Services panel per courier ── */}
        {courierKeys.map((key) => (
          <Tabs.Panel key={key} value={key} pt="sm">
            <Stack gap="xs">
              {grouped[key].services.map((opt) => {
                const isSelected = selectedCourier === opt.courier && selectedService === opt.service
                return (
                  <UnstyledButton
                    key={`${opt.courier}|${opt.service}`}
                    onClick={() => onChange(opt.courier, opt.service)}
                    style={{ width: '100%' }}
                  >
                    <Card
                      withBorder
                      p="md"
                      radius="md"
                      style={{
                        borderColor: isSelected
                          ? 'var(--mantine-color-blue-6)'
                          : 'var(--mantine-color-default-border)',
                        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : undefined,
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected
                          ? '0 0 0 1px var(--mantine-color-blue-4)'
                          : undefined,
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap" align="center">
                        {/* Left: service info */}
                        <Group gap="sm" wrap="nowrap" align="center">
                          {/* Custom radio indicator */}
                          <Box
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-default-border)'}`,
                              backgroundColor: isSelected
                                ? 'var(--mantine-color-blue-6)'
                                : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isSelected && <IconCheck size={12} color="white" strokeWidth={3} />}
                          </Box>

                          <Stack gap={2}>
                            <Group gap="xs" wrap="wrap">
                              <Text fw={600} size="sm">
                                {opt.service}
                              </Text>
                              <Badge
                                size="xs"
                                color={getServiceBadgeColor(opt.service)}
                                variant="light"
                                radius="sm"
                              >
                                {getServiceLabel(opt.service)}
                              </Badge>
                            </Group>
                            {(opt.description || opt.etd) && (
                              <Group gap={4} wrap="nowrap">
                                {opt.etd && (
                                  <>
                                    <IconClock size={12} color="var(--mantine-color-dimmed)" />
                                    <Text size="xs" c="dimmed">
                                      {opt.etd} hari
                                    </Text>
                                  </>
                                )}
                                {opt.description && opt.etd && (
                                  <Text size="xs" c="dimmed">
                                    ·
                                  </Text>
                                )}
                                {opt.description && (
                                  <Text size="xs" c="dimmed" lineClamp={1}>
                                    {opt.description}
                                  </Text>
                                )}
                              </Group>
                            )}
                          </Stack>
                        </Group>

                        {/* Right: cost */}
                        <Text
                          fw={700}
                          size="sm"
                          c={isSelected ? 'blue.7' : 'dark'}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Rp {opt.cost.toLocaleString('id-ID')}
                        </Text>
                      </Group>
                    </Card>
                  </UnstyledButton>
                )
              })}
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  )
}
