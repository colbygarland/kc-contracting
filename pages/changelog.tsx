import { H2 } from '@/components/Headings'
import { Page } from '@/components/layout/Page'
import { List, ListItem } from '@chakra-ui/react'

const Update = ({
  title,
  updates,
}: {
  title: string
  updates: Array<string>
}) => {
  return (
    <div className="mb-20">
      <H2>{title}</H2>
      <List>
        {updates.map(update => (
          <ListItem key={update}>{update}</ListItem>
        ))}
      </List>
    </div>
  )
}

export default function Changelog() {
  return (
    <Page title="Changelog">
      <Update
        title="December 27, 2024"
        updates={['Added dark mode support', 'Added ticket rejection']}
      />
      <Update title="December 15, 2023" updates={['Fixed mobile views']} />
    </Page>
  )
}
