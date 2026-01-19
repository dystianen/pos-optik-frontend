import { useProducts } from '@/hooks/useProducts'
import { formatCurrency, formatSlug } from '@/utils/format'
import {
  ActionIcon,
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  Group,
  Popover,
  Stack,
  Text
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'

const Search = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [opened, { toggle }] = useDisclosure(false)

  const { data: products } = useProducts.getSearchProduct({
    q: debouncedSearch
  })

  const productLookup =
    products
      ?.flatMap((cat: any) => cat.products)
      .reduce((acc: any, product: any) => {
        acc[product.product_name] = {
          image: product.product_image_url,
          price: product.product_price,
          product_id: product.product_id
        }
        return acc
      }, {}) ?? {}

  const autocompleteData =
    products?.flatMap((category: any) =>
      category.products.map((product: any) => ({
        value: product.product_name,
        group: category.category_name,
        category_name: category.category_name
      }))
    ) ?? []

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {
    const product = productLookup[option.value]

    if (!product) return null

    return (
      <Group gap="sm" wrap="nowrap">
        <Avatar src={product.image} size={36} radius="md" />

        <Stack gap={0}>
          <Text fz={14} fw={500}>
            {option.value}
          </Text>
          <Text fz={12} c="dimmed">
            {formatCurrency(product.price)}
          </Text>
        </Stack>
      </Group>
    )
  }

  return (
    <>
      <Autocomplete
        className="hidden md:block"
        w={{ lg: 300 }}
        value={search}
        onChange={setSearch}
        data={autocompleteData}
        renderOption={renderAutocompleteOption}
        placeholder="Search eyewear, lenses, brands..."
        leftSection={<IconSearch size={18} />}
        maxDropdownHeight={320}
        mr={'lg'}
        radius={'md'}
        onOptionSubmit={(value) => {
          const selected = autocompleteData.find((item: any) => item.value === value)
          if (!selected) return
          router.push(`/product/${formatSlug(selected.category_name)}?search=${search}`)
        }}
      />

      <Box maw={400} mx="auto" className="block md:hidden">
        <Popover width={'90%'} position="bottom" withArrow shadow="xl">
          <Popover.Target>
            <ActionIcon variant="transparent" onClick={toggle}>
              <IconSearch />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Autocomplete
              w={{ base: '100%', lg: 300 }}
              value={search}
              onChange={setSearch}
              data={autocompleteData}
              renderOption={renderAutocompleteOption}
              placeholder="Search eyewear, lenses, brands..."
              leftSection={<IconSearch size={18} />}
              maxDropdownHeight={320}
              mr={'lg'}
              radius={'md'}
              onOptionSubmit={(value) => {
                const selected = autocompleteData.find((item: any) => item.value === value)
                if (!selected) return
                router.push(`/product/${formatSlug(selected.category_name)}?search=${search}`)
              }}
            />
          </Popover.Dropdown>
        </Popover>
      </Box>
    </>
  )
}

export default Search
