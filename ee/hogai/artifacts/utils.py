from typing import Any, TypeGuard

from posthog.schema import ArtifactContentType, ArtifactMessage


def is_visualization_artifact_message(message: Any) -> TypeGuard[ArtifactMessage]:
    return isinstance(message, ArtifactMessage) and message.content_type == ArtifactContentType.VISUALIZATION
