import { useSearchProduct } from '@/features/product/hooks'
import { formatCurrency, formatSlug } from '@/utils/format'
import { Autocomplete, AutocompleteProps, Avatar, Group, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useMemo, useState } from 'react'

const Search = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const { data: products } = useSearchProduct(debouncedSearch)

  const productLookup = useMemo(
    () =>
      products
        ?.flatMap((cat: any) => cat.products)
        .reduce((acc: any, product: any) => {
          acc[product.product_name] = {
            image: product.product_image_url,
            price: product.product_price,
            product_id: product.product_id
          }
          return acc
        }, {}) ?? {},
    [products]
  )

  const autocompleteData = useMemo(
    () =>
      products?.flatMap((category: any) =>
        category.products.map((product: any) => ({
          value: product.product_name,
          group: category.category_name,
          category_name: category.category_name
        }))
      ) ?? [],
    [products]
  )

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
    <Autocomplete
      w="100%"
      value={search}
      onChange={setSearch}
      data={autocompleteData}
      renderOption={renderAutocompleteOption}
      placeholder="Search eyewear..."
      leftSection={<IconSearch size={18} />}
      maxDropdownHeight={320}
      radius={'md'}
      onOptionSubmit={(value) => {
        const selected = autocompleteData.find((item: any) => item.value === value)
        if (!selected) return
        router.push(`/product/${formatSlug(selected.category_name)}?search=${search}`)
      }}
    />
  )
}

export default Search
