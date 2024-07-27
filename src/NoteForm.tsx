import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";
import ReactMarkdown from "react-markdown";
import SplitPane from "split-pane-react/esm/SplitPane";
import "split-pane-react/esm/themes/default.css";
import "./NoteForm.css";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [markdownContent, setMarkdownContent] = useState(markdown);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const [sizes, setSizes] = useState([50, 50]);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownContent,
      tags: selectedTags,
    });
    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    }),
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <div className="markdown-container">
            <SplitPane
              split="vertical"
              sizes={sizes}
              onChange={setSizes}
              sashRender={() => <div className="sash-custom-class" />}
            >
              <div className="pane-container">
                <h4 className="pane-heading">Write</h4>
                <Form.Control
                  as="textarea"
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  required
                  className="markdown-input"
                />
              </div>
              <div className="pane-container">
                <h4 className="pane-heading">Preview</h4>
                <div className="markdown-preview">
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              </div>
            </SplitPane>
          </div>
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
