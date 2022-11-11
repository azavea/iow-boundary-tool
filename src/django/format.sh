#!/bin/bash

# Run isort --check-only before fixing to ensure a failure code is emitted
if ! isort ${*:1} --check-only; then
    isort ${*:1}
fi

# Run black with --check before fixing to ensure a failure code is emitted
if ! black \
    --skip-string-normalization \
    --extend-exclude migrations ${*:1} \
    --quiet --check; then
        black \
            --skip-string-normalization \
            --extend-exclude migrations \
            --quiet ${*:1}
fi
