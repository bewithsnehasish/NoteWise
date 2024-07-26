import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { useMemo, useState } from "react";
import { Tag } from "./App";
import styles from "./NoteList.module.css";
import ReactMarkdown from "react-markdown";
import SplitPane from "split-pane-react/esm/SplitPane";
import "split-pane-react/esm/themes/default.css";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onCreateNote: (data: { title: string; body: string; tags: Tag[] }) => void;
};

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
  body: string;
};

export function NoteList({
  availableTags,
  notes,
  onCreateNote,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteBody, setNewNoteBody] = useState("");
  const [sizes, setSizes] = useState([50, 50]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id),
          ))
      );
    });
  }, [title, selectedTags, notes]);

  const handleCreateNote = () => {
    onCreateNote({ title, body: newNoteBody, tags: selectedTags });
    setIsCreating(false);
    setTitle("");
    setNewNoteBody("");
    setSelectedTags([]);
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Button variant="primary" onClick={() => setIsCreating(true)}>
              Create
            </Button>
            <Button variant="outline-secondary">Edit Tags</Button>
          </Stack>
        </Col>
      </Row>
      {isCreating ? (
        <Form className="mb-4">
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tags">
            <Form.Label>Tags</Form.Label>
            <ReactSelect
              value={selectedTags.map((tag) => ({
                label: tag.label,
                value: tag.id,
              }))}
              options={availableTags.map((tag) => ({
                label: tag.label,
                value: tag.id,
              }))}
              onChange={(tags) =>
                setSelectedTags(
                  tags.map((tag) => ({ label: tag.label, id: tag.value })),
                )
              }
              isMulti
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="body">
            <Form.Label>Body</Form.Label>
            <div
              style={{
                height: "400px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <SplitPane
                split="vertical"
                sizes={sizes}
                onChange={setSizes}
                sashRender={() => (
                  <div style={{ width: "4px", backgroundColor: "#ccc" }} />
                )}
              >
                <div
                  style={{
                    height: "100%",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  <Form.Control
                    as="textarea"
                    value={newNoteBody}
                    onChange={(e) => setNewNoteBody(e.target.value)}
                    style={{
                      resize: "none",
                      height: "100%",
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "10px",
                    overflow: "auto",
                    height: "100%",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <ReactMarkdown>{newNoteBody}</ReactMarkdown>
                </div>
              </SplitPane>
            </div>
          </Form.Group>
          <Button variant="primary" onClick={handleCreateNote}>
            Save
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setIsCreating(false)}
          >
            Cancel
          </Button>
        </Form>
      ) : (
        <>
          <Form>
            <Row className="mb-4">
              <Col>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="tags">
                  <Form.Label>Tags</Form.Label>
                  <ReactSelect
                    value={selectedTags.map((tag) => ({
                      label: tag.label,
                      value: tag.id,
                    }))}
                    options={availableTags.map((tag) => ({
                      label: tag.label,
                      value: tag.id,
                    }))}
                    onChange={(tags) =>
                      setSelectedTags(
                        tags.map((tag) => ({
                          label: tag.label,
                          id: tag.value,
                        })),
                      )
                    }
                    isMulti
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Row xs={1} lg={3} xl={4} className="g-3">
            {filteredNotes.map((note) => (
              <Col key={note.id}>
                <NoteCard
                  id={note.id}
                  title={note.title}
                  tags={note.tags}
                  body={note.body}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}
