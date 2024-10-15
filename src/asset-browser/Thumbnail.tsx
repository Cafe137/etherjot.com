import Swal from 'sweetalert2'
import { Button } from '../Button'
import { onAssetDelete, onAssetRename, onContentInsert } from '../GlobalContext'
import { Horizontal } from '../Horizontal'
import { Vertical } from '../Vertical'

interface Props {
    name: string
    reference: string
}

export function Thumbnail({ name, reference }: Props) {
    async function onRename() {
        const newName = await Swal.fire({
            title: 'New Name',
            input: 'text',
            inputValue: name,
            showCancelButton: true
        })
        if (!newName.value) {
            return
        }
        onAssetRename.publish({
            reference,
            name: newName.value!
        })
    }

    async function onDelete() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        onAssetDelete.publish(reference)
    }

    async function onInsert() {
        onContentInsert.publish(`\n\n![img alt here](http://localhost:1633/bytes/${reference})`)
    }

    return (
        <Vertical gap={2}>
            <img className="thumbnail-image" src={`http://localhost:1633/bytes/${reference}`} />
            <p className="thumbnail-name">{name}</p>
            <Horizontal gap={8}>
                <Button small onClick={onInsert}>
                    Insert
                </Button>
                <Button small onClick={onRename}>
                    Rename
                </Button>
                <Button small onClick={onDelete}>
                    Delete
                </Button>
            </Horizontal>
        </Vertical>
    )
}
