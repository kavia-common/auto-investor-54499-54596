#!/bin/bash
cd /home/kavia/workspace/code-generation/auto-investor-54499-54596/Auto_InvestorMonolithicApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

